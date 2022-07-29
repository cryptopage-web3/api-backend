export interface PaginationQuery {
    limit?: string
    offset?: string
}

export interface ICollectionsFilter {
    name?: string
    blockchain?: string
}

export interface CollectionsQuery extends PaginationQuery {
    filter?: ICollectionsFilter
}

export interface INftItemsFilter {
    collectionId?: Array<number>
}

export interface NftItemsQuery extends PaginationQuery {
    filter?:INftItemsFilter
}