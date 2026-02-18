export default async function (payload, env) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    try {
        const res = await fetch(
            `https://googleads.googleapis.com/v14/customers/${env.GADS_CUSTOMER_ID}:uploadClickConversions`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${env.GADS_ACCESS_TOKEN}`,
                    'developer-token': env.GADS_DEVELOPER_TOKEN
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            }
        )

        if (!res.ok) {
            const text = await res.text()
            return 'Request error: ' + text
            return
        }
    } catch {
        return 'Request failed'
    } finally {
        clearTimeout(timeout)
    }

    return 'Processed successfully'
}
