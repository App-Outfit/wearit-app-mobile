import * as React from 'react';

import { ModalWarning } from '../../../components/core/Modal';

export function DeconnexionModal({ open, onCancel }) {
    return (
        <ModalWarning
            open={open}
            onCancel={onCancel}
            textHeader={'Se déconnecter ?'}
            textSubHeader={'Etes-vous sûre de vouloir partir ?'}
            textButtonConfirm={'Oui, me déconnecter'}
            textButtonCancel={'Non, annuler'}
        />
    );
}
