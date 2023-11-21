import React, { forwardRef } from 'react';
import {
  Box,
  BoxProps,
  useStyles,
  StylesApiProps,
  ElementProps,
  MantineSize,
  getFontSize,
  getSize,
  Factory,
  InputDescription,
  InputError,
} from '@mantine/core';
import classes from './inline-input.module.css';

export const InlineInputClasses = classes;

export type InlineInputStylesNames =
  | 'root'
  | 'body'
  | 'labelWrapper'
  | 'label'
  | 'description'
  | 'error';

export interface InlineInputProps
  extends BoxProps,
    StylesApiProps<InlineInputFactory>,
    ElementProps<'div'> {
  __staticSelector: string;
  __stylesApiProps: Record<string, any>;
  label: React.ReactNode;
  description: React.ReactNode;
  id: string;
  disabled: boolean | undefined;
  error: React.ReactNode;
  size: MantineSize | (string & {}) | undefined;
  labelPosition?: 'left' | 'right';
}

export type InlineInputFactory = Factory<{
  props: any;
  stylesNames: InlineInputStylesNames;
}>;

export const InlineInput = forwardRef<HTMLDivElement, InlineInputProps>(
  (
    {
      __staticSelector,
      __stylesApiProps,
      className,
      classNames,
      styles,
      unstyled,
      children,
      label,
      description,
      id,
      disabled,
      error,
      size,
      labelPosition = 'left',
      variant,
      style,
      vars,
      ...others
    },
    ref
  ) => {
    const getStyles = useStyles<InlineInputFactory>({
      name: __staticSelector,
      props: __stylesApiProps,
      className,
      style,
      classes,
      classNames,
      styles,
      unstyled,
    });

    return (
      <Box
        {...getStyles('root')}
        ref={ref}
        __vars={{
          '--label-fz': getFontSize(size),
          '--label-lh': getSize(size, 'label-lh'),
        }}
        mod={{ 'label-position': labelPosition }}
        variant={variant}
        size={size}
        {...others}
      >
        <div {...getStyles('body')}>
          {children}

          <div {...getStyles('labelWrapper')}>
            {label && (
              <label {...getStyles('label')} data-disabled={disabled || undefined} htmlFor={id}>
                {label}
              </label>
            )}

            {description && (
              <InputDescription size={size} __inheritStyles={false} {...getStyles('description')}>
                {description}
              </InputDescription>
            )}

            {error && error !== 'boolean' && (
              <InputError size={size} __inheritStyles={false} {...getStyles('error')}>
                {error}
              </InputError>
            )}
          </div>
        </div>
      </Box>
    );
  }
);

InlineInput.displayName = '@mantine/core/InlineInput';
