import type { Database as DB } from './types';

declare global {
  type Database = DB;
  type Tables<T extends keyof DB['public']['Tables']> = DB['public']['Tables'][T]['Row'];
  type Enums<T extends keyof DB['public']['Enums']> = DB['public']['Enums'][T];
  type Rpc<T extends keyof DB['public']['Functions']> = DB['public']['Functions'][T]['Returns'];
  type RpcArgs<T extends keyof DB['public']['Functions']> = DB['public']['Functions'][T]['Args'];
  type TableNames = keyof DB['public']['Tables'];
}
