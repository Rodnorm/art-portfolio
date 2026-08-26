import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO/SEO'
import type { PriceItem } from '../types'
import styles from './Prices.module.css'

const priceKeys = [
  'pencil_portrait',
  'oil_portrait_a4',
  'oil_portrait_60x50',
  'oil_portrait_pet',
  'watercolor',
] as const

export default function Prices() {
  const { t, i18n } = useTranslation()

  const priceList: PriceItem[] = priceKeys.map((key) => ({
    name: t(`prices.${key}.name`),
    price: t(`prices.${key}.price`),
    additional: i18n.exists(`prices.${key}.additional`)
      ? t(`prices.${key}.additional`)
      : undefined,
    note: t(`prices.${key}.note`),
  }))

  return (
    <>
      <SEO
        title={t('prices.prices')}
        description="Preços para pinturas e desenhos personalizados - Retratos a lápis, óleo, aquarela e muito mais."
      />
      <section className={styles.section} id="precos">
        <div className={styles.content}>
          <h2 className={styles.title}>{t('prices.prices')}</h2>

          <ol className={styles.list}>
            {priceList.map((item, index) => (
              <li className={styles.item} key={priceKeys[index]}>
                <span className={styles.number} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className={styles.itemContent}>
                  <h3 className={styles.itemTitle}>{item.name}</h3>
                  <div className={styles.details}>
                    <p className={styles.detailRow}>
                      <strong>{t('prices.price')}</strong>
                      <span>{item.price}</span>
                    </p>
                    {item.additional && (
                      <p className={styles.additional}>{item.additional}</p>
                    )}
                    {item.note && (
                      <p className={styles.detailRow}>
                        <strong>{t('prices.note')}</strong>
                        <span>{item.note}</span>
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
