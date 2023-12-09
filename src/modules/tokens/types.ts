export interface ITokenManager {
    getWalletTokens(address: string):Promise<ITokensResponse>
}

export interface IToken{
    name: string
    symbol: string
    logo: string
    address: string
    balance: number
    percentChange: number
    price: number
    balancePrice: number
}

export interface ITokensResponse{
    tokens: IToken[]
}

const pageToken = {
    name: 'Page',
    symbol: 'PAGE',
    logo: 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjIiIGJhc2VQcm9maWxlPSJ0aW55LXBzIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4Ij48dGl0bGU+TG9nbzwvdGl0bGU+PHN0eWxlPnRzcGFuIHsgd2hpdGUtc3BhY2U6cHJlIH0gLnNocDAgeyBmaWxsOiAjMjg4YWYyIH0gLnNocDEgeyBmaWxsOiAjMjM3OWQ1IH0gLnNocDIgeyBmaWxsOiAjMjVhYWZmIH0gLnNocDMgeyBmaWxsOiAjMmE5MWZmIH0gPC9zdHlsZT48cGF0aCBpZD0iU2hhcGUgMTggY29weSIgY2xhc3M9InNocDAiIGQ9Ik0wLjU2IDQuMjlMMTEuMjYgOS4yMUwyMy43OSA0Ni45OUwwLjU2IDM1LjE1TDAuNTYgNC4yOVoiIC8+PHBhdGggaWQ9IlNoYXBlIDE4IiBjbGFzcz0ic2hwMSIgZD0iTTcuNTQgMEwyMy43OCAxNi4wNkwyMy44NSA0Ny41NEw3LjkyIDM0LjQ0TDcuNTQgMFoiIC8+PHBhdGggaWQ9IlNoYXBlIDE4IGNvcHkgMiIgY2xhc3M9InNocDIiIGQ9Ik00Ny4yMSA0LjI5TDM2LjUgOS4yMUwyMy45NyA0Ni45OUw0Ny4yMSAzNS4xNUw0Ny4yMSA0LjI5WiIgLz48cGF0aCBpZD0iU2hhcGUgMTggY29weSAzIiBjbGFzcz0ic2hwMyIgZD0iTTM5Ljk2IDBMMjMuMDcgMTYuMDZMMjMuMTQgNDcuNTRMMzkuNTggMzQuNDRMMzkuOTYgMFoiIC8+PC9zdmc+',
    balance: 0,
    percentChange: 0,
    price: 0,
    balancePrice: 0
};

export const pageTokenMumbai:IToken = Object.assign({}, pageToken,{address:'0x6d8fbfb4a7264f7dcaae268cec82ece30daad09a'})