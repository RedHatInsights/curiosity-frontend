import React from 'react';
import {
  AlertActionLink,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant
} from '@patternfly/react-core';
import { translate } from '../i18n/i18nHelpers';

/**
 * @memberof BannerMessages
 * @module BannerMessagesModal
 */

/**
 * A self-contained modal wrapper for banner messages.
 *
 * @param {object} props
 * @param {React.ReactNode} props.modalTitle
 * @param {React.ReactNode} [props.modalContent]
 * @param {React.ReactNode} props.children
 * @param {translate} [props.t=translate]
 * @returns {JSX.Element}
 */
const BannerMessagesModal = ({ modalTitle, modalContent = '...', children, t = translate }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const onClick = () => {
    setIsOpen(true);
  };

  return (
    <React.Fragment>
      <Modal
        appendTo={document.querySelector('.curiosity')}
        className="curiosity-banner-modal"
        onClose={onClose}
        isOpen={isOpen}
        variant={ModalVariant.small}
      >
        <ModalHeader title={modalTitle} />
        <ModalBody>
          <div data-test="bannerMessageModalContent">{modalContent}</div>
        </ModalBody>
        <ModalFooter>
          <Button key="confirm" variant="secondary" onClick={onClose}>
            {t('curiosity-banner.modal', { context: ['label', 'close'] })}
          </Button>
        </ModalFooter>
      </Modal>
      <AlertActionLink data-test="bannerMessageModalLink" isInline component="a" onClick={onClick}>
        {children}
      </AlertActionLink>
    </React.Fragment>
  );
};
export { BannerMessagesModal as default, BannerMessagesModal };
