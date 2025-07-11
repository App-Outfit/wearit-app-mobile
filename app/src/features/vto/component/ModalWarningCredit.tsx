import * as React from 'react';

import { ModalWarning } from '../../../components/core/Modal';

export function ModalWarningCredit({ open, onCancel, onAccept }) {
    return (
        <ModalWarning
            open={open}
            onCancel={onCancel}
            onAccept={onAccept}
            textHeader={
                'Vous avez atteint votre quota de X essais par jour en mode gratuit'
            }
            textSubHeader={'Rechargez des crédits pour continuer'}
            textButtonConfirm={'Recharger'}
            textButtonCancel={'Annuler'}
        />
    );
}
