import React from 'react';
import { useId, useUncontrolled } from '@mantine/hooks';
import {
  BoxProps,
  StylesApiProps,
  factory,
  ElementProps,
  useProps,
  useStyles,
  MantineColor,
  MantineSize,
  MantineRadius,
  extractStyleProps,
  getRadius,
  Box,
  getSize,
  getThemeColor,
  createVarsResolver,
  Factory,
} from '@mantine/core';
import classes from './labelled-switch.module.css';
import {
  InlineInput,
  InlineInputStylesNames,
  InlineInputClasses,
} from '@/components/mantine-extensions/inline-input';

export type LabelledSwitchStylesNames =
  | 'root'
  | 'track'
  | 'trackLabel'
  | 'thumb'
  | 'input'
  | InlineInputStylesNames;
export type LabelledSwitchCssVariables = {
  root:
    | '--ls-radius'
    | '--ls-height'
    | '--ls-width'
    | '--ls-thumb-size'
    | '--ls-label-font-size'
    | '--ls-track-label-padding'
    | '--ls-color';
};

export interface LabelledSwitchProps
  extends BoxProps,
    StylesApiProps<LabelledSwitchFactory>,
    ElementProps<'input', 'size'> {
  /** Id used to bind input and label, if not passed, unique id will be generated instead */
  id?: string;

  /** Inner label when Switch is in checked state */
  onLabel?: React.ReactNode;

  /** Inner label when Switch is in unchecked state */
  offLabel?: React.ReactNode;

  /** Key of `theme.colors` or any valid CSS color to set input color in checked state, `theme.primaryColor` by default */
  color?: MantineColor;

  /** Key of `theme.colors` or any valid CSS color to set input color in unchecked state, `light gray` by default */
  offColor?: MantineColor;

  /** Controls size of all elements */
  size?: MantineSize | (string & {});

  /** Key of `theme.radius` or any valid CSS value to set `border-radius,` "xl" by default */
  radius?: MantineRadius;

  /** Props passed down to the wrapper element */
  wrapperProps?: Record<string, any>;

  /** Description displayed below the label */
  description?: React.ReactNode;

  /** Error displayed below the label */
  error?: React.ReactNode;

  /** Assigns ref of the root element, can be used with `Tooltip` and other similar components */
  rootRef?: React.ForwardedRef<HTMLDivElement>;
}

export type LabelledSwitchFactory = Factory<{
  props: LabelledSwitchProps;
  ref: HTMLInputElement;
  stylesNames: LabelledSwitchStylesNames;
  vars: LabelledSwitchCssVariables;
}>;

const defaultProps: Partial<LabelledSwitchProps> = {};

const varsResolver = createVarsResolver<LabelledSwitchFactory>(
  (theme, { radius, color, size, offColor }) => ({
    root: {
      '--ls-radius': radius === undefined ? undefined : getRadius(radius),
      '--ls-height': getSize(size, 'ls-height'),
      '--ls-width': getSize(size, 'ls-width'),
      '--ls-thumb-size': getSize(size, 'ls-thumb-size'),
      '--ls-label-font-size': getSize(size, 'ls-label-font-size'),
      '--ls-track-label-padding': getSize(size, 'ls-track-label-padding'),
      '--ls-color': color ? getThemeColor(color, theme) : undefined,
      '--ls-color-off': offColor ? getThemeColor(offColor, theme) : undefined,
    },
  })
);

export const LabelledSwitch = factory<LabelledSwitchFactory>((_props, ref) => {
  const props = useProps('LabelledSwitch', defaultProps, _props);
  const {
    classNames,
    className,
    style,
    styles,
    unstyled,
    vars,
    color,
    onLabel,
    offLabel,
    offColor,
    id,
    size,
    radius,
    wrapperProps,
    children,
    checked,
    defaultChecked,
    onChange,
    description,
    error,
    disabled,
    variant,
    rootRef,
    ...others
  } = props;

  const getStyles = useStyles<LabelledSwitchFactory>({
    name: 'LabelledSwitch',
    props,
    classes,
    className,
    style,
    classNames,
    styles,
    unstyled,
    vars,
    varsResolver,
  });

  const { styleProps, rest } = extractStyleProps(others);
  const uuid = useId(id);

  const [_checked, handleChange] = useUncontrolled({
    value: checked,
    defaultValue: defaultChecked,
    finalValue: false,
  });

  return (
    <InlineInput
      {...getStyles('root')}
      __staticSelector="LabelledSwitch"
      __stylesApiProps={props}
      id={uuid}
      size={size}
      label={undefined}
      description={description}
      error={error}
      disabled={disabled}
      classNames={classNames}
      styles={styles}
      unstyled={unstyled}
      data-checked={_checked || undefined}
      variant={variant}
      ref={rootRef}
      {...styleProps}
      {...wrapperProps}
    >
      <input
        {...rest}
        disabled={disabled}
        checked={_checked}
        onChange={(event) => {
          onChange?.(event);
          handleChange(event.currentTarget.checked);
        }}
        id={uuid}
        ref={ref}
        type="checkbox"
        {...getStyles('input')}
      />

      <Box component="label" htmlFor={uuid} mod={{ error }} {...getStyles('track')}>
        <div {...getStyles('trackLabel')}>
          <span
            style={{
              transform: `translateX(${_checked ? 0 : -200}%)`,
              transition: 'transform 150ms',
              transitionDelay: _checked ? '75ms' : '0ms',
            }}
          >
            {onLabel}
          </span>
          <span
            style={{
              transform: `translateX(${_checked ? 200 : 0}%)`,
              transition: 'transform 150ms',
              transitionDelay: _checked ? '0ms' : '75ms',
            }}
          >
            {offLabel}
          </span>
        </div>
      </Box>
    </InlineInput>
  );
});

LabelledSwitch.classes = { ...classes, ...InlineInputClasses };
LabelledSwitch.displayName = 'LabelledSwitch';
