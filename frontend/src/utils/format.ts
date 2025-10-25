export const formatMoney = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
export const formatDate = (iso: string) => new Date(iso).toLocaleDateString()
