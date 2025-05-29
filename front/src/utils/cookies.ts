export const getCookie = (cookieName: string): string | undefined => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${cookieName}=`)
    if(parts.length === 2) return parts.pop()?.split(';').shift()
}