export default async function (payload, meta, env) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    try {
        const res = await fetch(
            `https://www.google-analytics.com/mp/collect?measurement_id=${meta.gaMeasurementId}&api_secret=${env.GA_ACCESS_TOKEN}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: controller.signal
            }
        )

        if (!res.ok) {
            const text = await res.text()
            return 'Request error: ' + text
        }
    } catch {
        return 'Request failed'
    } finally {
        clearTimeout(timeout)
    }

    return `Processed succesfully`
}