export function getSigner(library: any, account: string) {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
export function getProviderOrSigner(library: any, account?: string) {
  return account ? getSigner(library, account) : library;
}
