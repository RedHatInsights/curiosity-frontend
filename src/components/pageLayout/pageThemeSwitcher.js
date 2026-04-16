import React, { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@patternfly/react-core';
import { MoonIcon, SunIcon } from '@patternfly/react-icons';
import { translate } from '../i18n/i18nHelpers';

/**
 * @memberof PageLayout
 * @module PageThemeSwitcher
 */

const DARK_THEME_CLASS = 'pf-v6-theme-dark';

/**
 * Render a light/dark theme toggle. Toggling "dark" adds the
 * `pf-v6-theme-dark` class to the root `<html>` element; toggling "light"
 * removes it.
 *
 * Note: This component is only intended to be used within the development run of the application.
 * The hardcoded className is only used here for development purposes.
 *
 * @param {object} props
 * @param {string} [props.className='']
 * @param {translate} [props.t=translate]
 * @returns {JSX.Element}
 */
const PageThemeSwitcher = ({ className = '', t = translate }) => {
  const [isDark, setIsDark] = useState(() => document?.documentElement?.classList?.contains?.(DARK_THEME_CLASS));

  const onThemeChange = dark => {
    document?.documentElement?.classList?.toggle?.(DARK_THEME_CLASS, dark);
    setIsDark(dark);
  };

  return (
    <ToggleGroup aria-label={t('curiosity-view.theme-toggle')} className={className}>
      <ToggleGroupItem
        aria-label={t('curiosity-view.theme-toggle', { context: ['light'] })}
        icon={<SunIcon />}
        buttonId="curiosity-theme-toggle-light"
        isSelected={!isDark}
        onChange={() => onThemeChange(false)}
      />
      <ToggleGroupItem
        aria-label={t('curiosity-view.theme-toggle', { context: ['dark'] })}
        icon={<MoonIcon />}
        buttonId="curiosity-theme-toggle-dark"
        isSelected={isDark}
        onChange={() => onThemeChange(true)}
      />
    </ToggleGroup>
  );
};

export { PageThemeSwitcher as default, PageThemeSwitcher };
