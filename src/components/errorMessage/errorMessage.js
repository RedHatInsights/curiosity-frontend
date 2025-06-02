import React, { useState } from 'react';
import { Button, EmptyState, EmptyStateBody, EmptyStateVariant, Title } from '@patternfly/react-core';
import { ExportIcon, CogIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { helpers, downloadHelpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * Error message component wrapper.
 *
 * @memberof Components
 * @module ErrorMessage
 */

/**
 * Display 4xx, 5xx level error messages for components.
 *
 * @fires onClickShowErrorDisplay
 * @fires onClickDownloadLog
 * @fires onKeyUpEvent
 * @param {object} props
 * @param {string} [props.description]
 * @param {Array<number>} [props.keyCode=[68, 69, 66, 85, 71]] Key code defaults to "debug"
 * @param {downloadHelpers.debugLog} [props.getDebugLog=downloadHelpers.debugLog]
 * @param {string|Error} [props.message]
 * @param {string} [props.title]
 * @param {translate} [props.t=translate]
 * @returns {JSX.Element}
 */
const ErrorMessage = ({
  description,
  keyCode = [68, 69, 66, 85, 71],
  getDebugLog = downloadHelpers.debugLog,
  message,
  title,
  t = translate
}) => {
  const [isErrorDisplay, setIsErrorDisplay] = useState(false);
  const [debugCode, setDebugCode] = useState([]);
  const errorStr = (typeof message === 'string' && message) || message?.message;
  const isDebugCode = debugCode.join('') === keyCode.join('');

  /**
   * Flip display to show generalized errors
   *
   * @event onClickShowErrorDisplay
   */
  const onClickShowErrorDisplay = () => {
    setIsErrorDisplay(!isErrorDisplay);
  };

  /**
   * Download an error log
   *
   * @event onClickDownloadLog
   */
  const onClickDownloadLog = () => {
    if (typeof getDebugLog === 'function') {
      getDebugLog();
    }
  };

  /**
   * Type and confirm a keyword
   *
   * @event onKeyUpEvent
   * @param {event} event
   */
  const onKeyUpEvent = event => {
    setDebugCode(prevState => {
      if (isDebugCode) {
        return prevState;
      }

      if (keyCode[prevState.length] === event.keyCode) {
        return [...prevState, event.keyCode];
      }

      return [];
    });
  };

  const cause = message?.cause && (
    <textarea
      className="curiosity-error__textarea"
      onKeyUp={onKeyUpEvent}
      readOnly
      rows="10"
      value={JSON.stringify([message.cause], null, 2)}
    />
  );

  const isCauseOrError = (cause || errorStr) && true;

  return (
    <div className="fadein" aria-live="polite">
      {isCauseOrError && (
        <Button
          icon={<CogIcon />}
          className="curiosity-error__link"
          title={t('curiosity-view.error', { context: 'debug' })}
          style={{ float: 'right' }}
          variant="link"
          onClick={() => onClickShowErrorDisplay()}
        >
          <span className="sr-only">{t('curiosity-view.error', { context: 'debug' })}</span>
        </Button>
      )}
      {isDebugCode && isErrorDisplay && isCauseOrError && (
        <Button variant="link" onClick={() => onClickDownloadLog()} icon={<ExportIcon />}>
          {t('curiosity-view.error', { context: 'download' })}
        </Button>
      )}
      {(isErrorDisplay && (cause || errorStr)) || (
        <EmptyState
          titleText={
            <Title headingLevel="h2" size="lg">
              {title || t('curiosity-view.error', { context: 'title', appName: helpers.UI_INTERNAL_NAME })}
            </Title>
          }
          icon={ExclamationCircleIcon}
          variant={EmptyStateVariant.full}
        >
          <EmptyStateBody>
            {description ||
              t('curiosity-view.error', { context: 'description' }, [
                <Button isInline component="a" variant="link" target="_blank" href={helpers.UI_LINK_PLATFORM_STATUS} />
              ])}
          </EmptyStateBody>
        </EmptyState>
      )}
    </div>
  );
};

export { ErrorMessage as default, ErrorMessage };
