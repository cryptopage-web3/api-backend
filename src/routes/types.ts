export interface PaginationQuery {
    limit?: string
    offset?: string
}

export interface CollectionsQuery extends PaginationQuery {
    filter?:{
        name?: string
        blockchain?: string
    }
}

export interface NftItemsQuery extends PaginationQuery {
    filter?:{
        collectionId?: Array<number>
    }
}