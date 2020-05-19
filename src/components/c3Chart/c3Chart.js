import React from 'react';
import PropTypes from 'prop-types';
import c3 from 'c3';
import _isEqual from 'lodash/isEqual';
import 'c3/c3.min.css';
import { helpers } from '../../common';

/**
 * C3 wrapper.
 * Uses aspects from https://github.com/bcbcarl/react-c3js and https://github.com/wuct/react-c3-component
 *
 * @augments React.Component
 */
class C3Chart extends React.Component {
  state = { chart: null };

  node = React.createRef();

  componentDidMount() {
    this.generateChart();
  }

  componentDidUpdate(prevProps) {
    const { config } = this.props;

    if (!_isEqual(prevProps.config.data, config.data)) {
      this.generateChart();
    }
  }

  componentWillUnmount() {
    const { chart } = this.state;
    if (chart) {
      chart.destroy();
    }
    this.setState({ chart: null });
  }

  generateChart() {
    const { chart } = this.state;
    const { config, onComplete } = this.props;

    let updatedChart = chart;
    if (!updatedChart) {
      updatedChart = c3.generate({ bindto: this.node.current, ...config });
    }

    updatedChart.load({
      ...config.data,
      unload: config.unloadBeforeLoad || false,
      done: () => {
        this.setState({ chart: updatedChart }, () => {
          if (config.done) {
            config.done({ chart: updatedChart, config });
          } else {
            onComplete({ chart: updatedChart, config });
          }
        });
      }
    });
  }

  render() {
    const { chart } = this.state;
    const { className, children, config, style } = this.props;

    return (
      <div className={`curiosity-c3chart ${className}`} style={style}>
        <div ref={this.node} className="curiosity-c3chart-container" />
        {chart && (
          <div className="curiosity-c3chart-description">
            {(typeof children === 'function' && children({ chart, config })) || children}
          </div>
        )}
      </div>
    );
  }
}

/**
 * Prop types.
 *
 * @type {{children: Node|Function, onComplete: Function, className: string, style: object, config}}
 */
C3Chart.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  className: PropTypes.string,
  config: PropTypes.shape({
    unloadBeforeLoad: PropTypes.bool,
    data: PropTypes.object,
    done: PropTypes.func
  }),
  onComplete: PropTypes.func,
  style: PropTypes.object
};

/**
 * Default props.
 *
 * @type {{children: null, onComplete: Function, className: null, style: {}, config: {}}}
 */
C3Chart.defaultProps = {
  children: null,
  className: null,
  config: {},
  onComplete: helpers.noop,
  style: {}
};

export { C3Chart as default, C3Chart };
