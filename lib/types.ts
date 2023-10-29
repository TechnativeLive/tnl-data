export type PageProps<
  P extends Record<string, string> = Record<string, string>,
  SP extends Record<string, string> = Record<string, string>
> = {
  params?: P;
  searchParams?: SP;
};
