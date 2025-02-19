declare module "batch-promises" {
  export default function batchPromises<T>(
    batchSize: number,
    array: T[],
    callback: (item: T) => Promise<void>
  ): Promise<void>
}
