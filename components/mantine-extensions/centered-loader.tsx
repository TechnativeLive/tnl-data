import { Loader, LoaderProps } from '@mantine/core'
import clsx from 'clsx'

export function CenteredLoader({
  className,
  loaderClassName,
  ...props
}: LoaderProps & { loaderClassName?: string }) {
  return (
    <div className={clsx(className, 'flex justify-center items-center')}>
      <Loader {...props} className={loaderClassName} />
    </div>
  )
}
