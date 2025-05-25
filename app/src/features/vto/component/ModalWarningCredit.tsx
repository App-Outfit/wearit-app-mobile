import * as React from 'react';

import { ModalWarning } from '../../../components/core/Modal';

export function ModalWarningCredit({ open, onCancel }) {
    return (
        <ModalWarning
            open={open}
            onCancel={onCancel}
            textHeader={
                'Vous avez atteint votre quota de 10 essais par mois en mode gratuit'
            }
            textSubHeader={'Rechargez des crédits pour continuer'}
            textButtonConfirm={'Recharger'}
            textButtonCancel={'Annuler'}
        />
    );
}
