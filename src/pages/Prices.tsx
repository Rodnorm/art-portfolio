import { useTranslation } from 'react-i18next'
import { Box, Container, Typography } from '@mui/material'
import SEO from '../components/SEO/SEO'
import type { PriceItem } from '../types'
import './Prices.css'

const priceKeys = [
  'pencil_portrait',
  'oil_portrait_a4',
  'oil_portrait_60x50',
  'oil_portrait_pet',
  'watercolor',
] as const

export default function Prices() {
  const { t } = useTranslation()

  const priceList: PriceItem[] = priceKeys.map((key) => ({
    name: t(`prices.${key}.name`),
    price: t(`prices.${key}.price`),
    additional: t(`prices.${key}.additional`),
    note: t(`prices.${key}.note`),
  }))

  return (
    <>
      <SEO
        title={t('prices.prices')}
        description="Preços para pinturas e desenhos personalizados - Retratos a lápis, óleo, aquarela e muito mais."
      />
      <Container component="section" className="prices-section" id="precos">
        <h2 className="prices-title">{t('prices.prices')}</h2>

        <Box className="prices-list">
          {priceList.map((item, index) => (
            <Box className="price-item" key={index}>
              <Typography component="h3" variant="h6">
                {item.name}
              </Typography>
              <Typography>
                {t('prices.price')}: {item.price}
              </Typography>
              {item.additional && <Typography>{item.additional}</Typography>}
              {item.note && (
                <Typography>
                  <strong>{t('prices.note')}:</strong> {item.note}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </Container>
    </>
  )
}