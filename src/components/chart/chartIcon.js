import React from 'react';
import { EyeIcon, EyeSlashIcon, SquareIcon } from '@patternfly/react-icons';

/**
 * @memberof Chart
 * @module ChartIcon
 */

/**
 * Consistent icon sizing.
 *
 * @type {{xl, md: string, sm: string, lg: string}}
 */
const IconSize = { sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' };

/**
 * Consistent icon symbols
 *
 * @type {{eye: string, square: string, eyeSlash: string, infinity: string, threshold: string, dash: string}}
 */
const IconSymbol = {
  dash: 'dash',
  eye: 'eye',
  eyeSlash: 'eyeSlash',
  infinity: 'infinity',
  square: 'square',
  threshold: 'threshold'
};

/**
 * Emulate pf icon sizing for custom SVGs
 *
 * @param {string} size
 * @returns {string} em measurement
 */
const getSize = size => {
  if (!Number.isNaN(Number.parseFloat(size))) {
    return size;
  }

  switch (size) {
    case 'md':
      return '1.5em';
    case 'lg':
      return '2em';
    case 'xl':
      return '3em';
    case 'sm':
    default:
      return '1em';
  }
};

/**
 * Render an icon for use outside of Victory charts.
 *
 * @param {object} props
 * @param {string} [props.fill]
 * @param {string|IconSymbol} [props.symbol=IconSymbol.square]
 * @param {string|IconSize} [props.size=IconSize.sm]
 * @param {string} [props.title]
 * @returns {JSX.Element}
 */
const ChartIcon = ({ fill, symbol = IconSymbol.square, size = IconSize.sm, title, ...props }) => {
  const svgProps = { ...props };
  const iconProps = { size, title, ...props };
  const fontProps = { style: { fontSize: getSize(size) }, title, ...props };
  const emSvgSize = getSize(size);

  if (title) {
    svgProps['aria-labelledby'] = title;
  } else {
    svgProps['aria-hidden'] = true;
  }

  if (fill) {
    iconProps.color = fill;
    fontProps.style.color = fill;
  }

  const setIcon = () => {
    switch (symbol) {
      case 'dash':
        return (
          <span
            className="curiosity-icon__dash"
            style={{
              width: emSvgSize,
              height: `${Number.parseFloat(emSvgSize) / 2}em`
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 38 10" role="img" {...svgProps}>
              <rect y="5" width="10" height="10" fill={fill} />
              <rect x="14" y="5" width="10" height="10" fill={fill} />
              <rect x="28" y="5" width="10" height="10" fill={fill} />
            </svg>
          </span>
        );
      case 'threshold':
        return (
          <span
            className="curiosity-icon__threshold"
            style={{ width: `${Number.parseFloat(emSvgSize) * 2}em`, height: emSvgSize }}
          >
            <svg width="100%" height="100%" viewBox="0 0 18 10" role="img" {...svgProps}>
              <line
                x1={0}
                y1={(Number.parseFloat(emSvgSize) * 16) / 2}
                x2={Number.parseFloat(emSvgSize) * 16 * 3}
                y2={(Number.parseFloat(emSvgSize) * 16) / 2}
                stroke={fill}
                strokeWidth={3}
                strokeDasharray="4,3"
              />
            </svg>
          </span>
        );
      case 'eye':
        return <EyeIcon {...iconProps} />;
      case 'eyeSlash':
        return <EyeSlashIcon {...iconProps} />;
      case 'infinity':
        return (
          <span className="curiosity-icon__f-infinity" {...fontProps}>
            <span aria-hidden>&#x221e;</span>
          </span>
        );

      case 'square':
      default:
        return <SquareIcon {...iconProps} />;
    }
  };

  return <span className={`curiosity-chartarea__icon curiosity-chartarea__icon-${symbol}`}>{setIcon()}</span>;
};

export { ChartIcon as default, ChartIcon, IconSize, IconSymbol };
