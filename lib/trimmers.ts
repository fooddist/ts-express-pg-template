const __trim = (
  str: string,
  sym: string,
  { leading, trailing }: { leading?: boolean; trailing?: boolean; },
) => {
  const re = new RegExp(`${leading ? '^' : ''}${sym}${trailing ? '$' : ''}`);
  return str.replace(re, '');
};

export const trimLeadingDash = (str: string): string => __trim(str, '-', { leading: true });
export const trimTrailingDash = (str: string): string => __trim(str, '-', { trailing: true });

export const trimLeadingSlash = (str: string): string => __trim(str, '/', { leading: true });
export const trimTrailingSlash = (str: string): string => __trim(str, '/', { trailing: true });
