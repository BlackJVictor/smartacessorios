import { Product, PayloadSchemaType } from '../types';

export function generateProductPayload(product: Product, schemaType: PayloadSchemaType): Record<string, any> {
  switch (schemaType) {
    case 'rest_catalog_ingest':
      return {
        $schema: 'https://api.techcommerce.internal/schemas/v1/product-ingest.json',
        event_type: 'CATALOG_PRODUCT_UPSERT',
        timestamp: new Date().toISOString(),
        product: {
          id: product.id,
          sku: product.sku,
          gtin_ean13: product.ean,
          brand: {
            name: product.brand,
            normalized_slug: product.brand.toLowerCase().replace(/\s+/g, '-'),
          },
          category: {
            code: product.category,
            name: product.category === 'smartphones' ? 'Smartphones & Celulares' : product.category === 'cases' ? 'Capas & Proteção' : 'Áudio & Fones de Ouvido',
            vertical: 'consumer_electronics',
          },
          title: product.name,
          model_number: product.model,
          color_variant: product.color,
          status: product.status.toUpperCase(),
          pricing: {
            cost: product.pricing.costPrice,
            list_price: product.pricing.regularPrice,
            sale_price: product.pricing.promotionalPrice || product.pricing.regularPrice,
            margin_rate: Number((product.pricing.marginPercent / 100).toFixed(4)),
            currency: product.pricing.currency,
            tax_rate: Number((product.pricing.taxRatePercent / 100).toFixed(4)),
          },
          inventory: {
            sku: product.sku,
            physical_qty: product.stock.physical,
            reserved_qty: product.stock.reserved,
            available_qty: product.stock.available,
            safety_stock_threshold: product.stock.minSafetyStock,
            reorder_point: product.stock.reorderPoint,
            lead_time_days: product.stock.leadTimeDays,
            warehouse_location: product.stock.warehouseLocation,
            batch_id: product.stock.batchNumber,
          },
          specifications: product.category === 'smartphones' ? product.smartphoneSpecs : product.category === 'cases' ? product.caseSpecs : product.headphoneSpecs,
          seo_metadata: {
            title: product.copy.seoMetaTitle,
            description: product.copy.seoMetaDescription,
            slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            canonical_url: `https://techcommerce.com.br/p/${product.sku.toLowerCase()}`,
          },
          copywriting: {
            marketplace_title: product.copy.marketplaceTitle,
            short_pitch: product.copy.shortPitch,
            bullet_highlights: product.copy.keyBenefitsBullets,
            target_audience: product.copy.targetAudienceProfile,
            in_the_box: product.copy.boxContents,
            compatibility: product.copy.compatibilityNotes || null,
          },
          assets: {
            primary_image: product.images[0] || null,
            gallery: product.images,
          },
          metadata: {
            tags: product.tags,
            created_at: product.createdAt,
            updated_at: product.updatedAt,
          },
        },
      };

    case 'stock_sync_webhook':
      return {
        event_id: `evt_stock_${product.sku}_${Date.now()}`,
        event_name: 'inventory.stock_level.changed',
        source_system: 'WMS-CORE-CLUSTER-01',
        occurred_at: new Date().toISOString(),
        data: {
          sku: product.sku,
          ean: product.ean,
          product_name: product.name,
          warehouse: {
            code: 'WH-BR-SP-01',
            name: 'Centro de Distribuição Cajamar SP',
            aisle_bin: product.stock.warehouseLocation,
          },
          stock_balances: {
            on_hand: product.stock.physical,
            allocated_orders: product.stock.reserved,
            salable_inventory: product.stock.available,
            safety_buffer: product.stock.minSafetyStock,
          },
          replenishment: {
            status: product.stock.available <= product.stock.minSafetyStock 
              ? 'CRITICAL_LOW_STOCK' 
              : product.stock.available <= product.stock.reorderPoint 
              ? 'REORDER_POINT_REACHED' 
              : 'HEALTHY',
            reorder_point: product.stock.reorderPoint,
            supplier_lead_time_days: product.stock.leadTimeDays,
            lot_batch_code: product.stock.batchNumber,
          },
          pricing_context: {
            unit_cost: product.pricing.costPrice,
            total_inventory_cost: Number((product.stock.physical * product.pricing.costPrice).toFixed(2)),
            currency: product.pricing.currency,
          },
        },
      };

    case 'marketplace_feed':
      return {
        channel: 'OMNICHANNEL_TECH_FEED_V2',
        integration_target: 'MERCADO_LIVRE_AMAZON_SHOPIFY',
        item: {
          seller_custom_sku: product.sku,
          gtin: product.ean,
          title: product.copy.marketplaceTitle,
          brand: product.brand,
          model: product.model,
          condition: 'NEW_FACTORY_SEALED',
          currency_id: 'BRL',
          price: product.pricing.promotionalPrice || product.pricing.regularPrice,
          original_price: product.pricing.promotionalPrice ? product.pricing.regularPrice : undefined,
          available_quantity: product.stock.available,
          listing_type: 'gold_pro_fulfillment',
          shipping: {
            mode: 'me2_full',
            free_shipping: true,
            dimensions: product.category === 'smartphones' 
              ? { weight_kg: 0.45, length_cm: 18, width_cm: 10, height_cm: 5 }
              : product.category === 'cases'
              ? { weight_kg: 0.12, length_cm: 20, width_cm: 11, height_cm: 2.5 }
              : { weight_kg: 0.85, length_cm: 25, width_cm: 22, height_cm: 9 },
          },
          attributes: [
            { id: 'BRAND', value_name: product.brand },
            { id: 'MODEL', value_name: product.model },
            { id: 'COLOR', value_name: product.color },
            ...(product.category === 'smartphones' && product.smartphoneSpecs ? [
              { id: 'PROCESSOR_MODEL', value_name: product.smartphoneSpecs.chipset },
              { id: 'RAM_MEMORY', value_name: `${product.smartphoneSpecs.ramGb} GB` },
              { id: 'INTERNAL_MEMORY', value_name: `${product.smartphoneSpecs.storageGb} GB` },
              { id: 'MAIN_CAMERA_RESOLUTION', value_name: `${product.smartphoneSpecs.cameraMainMp} Mpx` },
              { id: 'BATTERY_CAPACITY', value_name: `${product.smartphoneSpecs.batteryMah} mAh` },
              { id: 'WITH_5G', value_name: product.smartphoneSpecs.network5G ? 'Sim' : 'Não' },
            ] : []),
            ...(product.category === 'cases' && product.caseSpecs ? [
              { id: 'CASE_MATERIAL', value_name: product.caseSpecs.material },
              { id: 'MAGSAFE_COMPATIBLE', value_name: product.caseSpecs.magSafeCompatible ? 'Sim' : 'Não' },
              { id: 'DROP_PROTECTION_METERS', value_name: `${product.caseSpecs.dropProtectionRatingMeters}m` },
            ] : []),
            ...(product.category === 'headphones' && product.headphoneSpecs ? [
              { id: 'AUDIO_CODECS', value_name: product.headphoneSpecs.codecs.join(', ') },
              { id: 'ACTIVE_NOISE_CANCELLATION', value_name: product.headphoneSpecs.ancType === 'adaptive_hybrid' || product.headphoneSpecs.ancType === 'active' ? 'Sim' : 'Não' },
              { id: 'BATTERY_DURATION_HOURS', value_name: `${product.headphoneSpecs.batteryWithAncHours}h` },
              { id: 'BLUETOOTH_VERSION', value_name: product.headphoneSpecs.bluetoothVer },
            ] : []),
          ],
          description: {
            plain_text: product.copy.shortPitch + '\n\n' + product.copy.keyBenefitsBullets.map(b => `• ${b}`).join('\n') + '\n\nConteúdo da embalagem:\n' + product.copy.boxContents.map(c => `- ${c}`).join('\n'),
          },
        },
      };

    case 'schema_org_json_ld':
      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images,
        description: product.copy.seoMetaDescription,
        sku: product.sku,
        gtin13: product.ean,
        mpn: product.model,
        brand: {
          '@type': 'Brand',
          name: product.brand,
        },
        offers: {
          '@type': 'Offer',
          url: `https://techcommerce.com.br/p/${product.sku.toLowerCase()}`,
          priceCurrency: product.pricing.currency,
          price: product.pricing.promotionalPrice || product.pricing.regularPrice,
          priceValidUntil: '2026-12-31',
          itemCondition: 'https://schema.org/NewCondition',
          availability: product.stock.available > 0 
            ? 'https://schema.org/InStock' 
            : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: 'TechCommerce Brasil',
          },
        },
        additionalProperty: Object.entries(
          product.category === 'smartphones' ? (product.smartphoneSpecs || {}) :
          product.category === 'cases' ? (product.caseSpecs || {}) :
          (product.headphoneSpecs || {})
        ).slice(0, 8).map(([key, value]) => ({
          '@type': 'PropertyValue',
          name: key,
          value: Array.isArray(value) ? value.join(', ') : String(value),
        })),
      };

    case 'vtex_product_payload':
      return {
        Name: product.name,
        DepartmentId: 10,
        CategoryId: product.category === 'smartphones' ? 101 : product.category === 'cases' ? 102 : 103,
        BrandId: product.brand === 'Samsung' ? 201 : product.brand === 'Apple' ? 202 : product.brand === 'Sony' ? 203 : 204,
        LinkId: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        RefId: product.sku,
        IsActive: product.status === 'active',
        TaxCode: '8517.13.00',
        MetaTagDescription: product.copy.seoMetaDescription,
        Description: product.copy.technicalMarkdownDescription,
        ShortDescription: product.copy.shortPitch,
        Skus: [
          {
            Id: parseInt(product.id.replace(/[^0-9]/g, '')) || 9901,
            ProductId: parseInt(product.id.replace(/[^0-9]/g, '')) || 9901,
            IsActive: true,
            Name: `${product.name} - ${product.color}`,
            RefId: product.sku,
            Ean: product.ean,
            Height: 5.0,
            Width: 10.0,
            Length: 18.0,
            WeightKg: 0.45,
            CommercialConditionId: 1,
            MeasurementUnit: 'un',
            UnitMultiplier: 1.0,
            ModalType: 1,
            KitItems: [],
            Specifications: [
              { FieldName: 'Cor', FieldValue: [product.color] },
              { FieldName: 'Ano Lançamento', FieldValue: [String(product.releaseYear)] },
            ],
          },
        ],
      };

    default:
      return {};
  }
}
