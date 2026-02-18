export default async function (payload, meta, env) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    try {
        const res = await fetch(
            `https://graph.facebook.com/v18.0/${meta.fbPixelId}/events?access_token=${env.FB_ACCESS_TOKEN}${meta.fbTestEventCode ? `&test_event_code=${meta.fbTestEventCode}` : ''}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: controller.signal
            }
        )

        const text = await res.text()

        if (!res.ok) {
            try {
                const json = JSON.parse(text)
                return 'Request error: ' + (json.error?.error_user_msg || json.error?.message || text)
            } catch {
                return 'Request error: ' + text
            }
        }
    } catch {
        return 'Request failed'
    } finally {
        clearTimeout(timeout)
    }

    return `Processed succesfully`
}