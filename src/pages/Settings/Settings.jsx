import { useEffect, useState } from 'react';

import PageHeader from '../../components/layout/PageHeader';

import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';

import {
    getSettings,
    updateSettings,
} from '../../api/settings.api';

function Settings() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({
            message,
            type,
        });
    };

    const loadSettings = async () => {
        try {
            setLoading(true);

            const response = await getSettings();

            if (response.success) {
                setSettings(response.data || null);
            } else {
                showToast(
                    response.error ||
                        'Impossible de charger les paramètres.',
                    'error'
                );
            }
        } catch (error) {
            console.error(error);

            showToast(
                error.response?.data?.error ||
                    'Erreur lors du chargement des paramètres.',
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setSettings((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        if (!settings?.id) {
            showToast(
                'Identifiant des paramètres introuvable.',
                'error'
            );

            return;
        }

        try {
            setSaving(true);

            const payload = {
                company_name: settings.company_name || '',
                address: settings.address || '',
                city: settings.city || '',
                postal_code: settings.postal_code || '',
                customs_code: settings.customs_code || '',
                rne: settings.rne || '',
                phone: settings.phone || '',
                financial_code: settings.financial_code || '',
                biat_account: settings.biat_account || '',
                attijari_account:
                    settings.attijari_account || '',
                next_transfer_number:
                    Number(settings.next_transfer_number) || 1,
            };

            const response = await updateSettings(
                settings.id,
                payload
            );

            if (!response.success) {
                showToast(
                    response.error ||
                        'Impossible d’enregistrer les paramètres.',
                    'error'
                );

                return;
            }

            setSettings(response.data || settings);

            showToast(
                'Paramètres enregistrés avec succès.'
            );
        } catch (error) {
            console.error(error);

            showToast(
                error.response?.data?.error ||
                    'Erreur lors de l’enregistrement.',
                'error'
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="page settings-page">
                <PageHeader
                    title="Paramètres"
                    description="Configuration de votre société et des virements."
                />

                <Card>
                    <div className="page-loading">
                        <div className="loading-spinner" />
                        <span>
                            Chargement des paramètres...
                        </span>
                    </div>
                </Card>
            </div>
        );
    }

    if (!settings) {
        return (
            <div className="page settings-page">
                <PageHeader
                    title="Paramètres"
                    description="Configuration de votre société et des virements."
                />

                <Card>
                    <div className="empty-state">
                        <h3>Paramètres introuvables</h3>
                        <p>
                            Aucun enregistrement de configuration
                            n'est disponible.
                        </p>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="page settings-page">
            <PageHeader
                title="Paramètres"
                description="Configurez les informations de votre société et les paramètres des virements."
                actions={
                    <Button
                        onClick={handleSave}
                        loading={saving}
                        disabled={saving}
                    >
                        Enregistrer
                    </Button>
                }
            />

            <div className="settings-grid">
                <Card
                    title="Informations de la société"
                    description="Ces informations sont utilisées sur les documents et formulaires."
                >
                    <div className="form-grid-2">
                        <Input
                            label="Raison sociale"
                            name="company_name"
                            value={settings.company_name || ''}
                            onChange={handleChange}
                        />

                        <Input
                            label="Téléphone"
                            name="phone"
                            value={settings.phone || ''}
                            onChange={handleChange}
                        />

                        <Input
                            label="Adresse"
                            name="address"
                            value={settings.address || ''}
                            onChange={handleChange}
                        />

                        <Input
                            label="Ville"
                            name="city"
                            value={settings.city || ''}
                            onChange={handleChange}
                        />

                        <Input
                            label="Code postal"
                            name="postal_code"
                            value={settings.postal_code || ''}
                            onChange={handleChange}
                        />

                        <Input
                            label="Code en douane"
                            name="customs_code"
                            value={settings.customs_code || ''}
                            onChange={handleChange}
                        />

                        <Input
                            label="RNE / Registre"
                            name="rne"
                            value={settings.rne || ''}
                            onChange={handleChange}
                        />

                        <Input
                            label="Code financier"
                            name="financial_code"
                            value={settings.financial_code || ''}
                            onChange={handleChange}
                        />
                    </div>
                </Card>

                <Card
                    title="Comptes bancaires"
                    description="Comptes utilisés pour les ordres de virement."
                >
                    <div className="form-grid-2">
                        <Input
                            label="Compte BIAT"
                            name="biat_account"
                            value={settings.biat_account || ''}
                            onChange={handleChange}
                        />

                        <Input
                            label="Compte Attijari Bank"
                            name="attijari_account"
                            value={
                                settings.attijari_account || ''
                            }
                            onChange={handleChange}
                        />
                    </div>
                </Card>

                <Card
                    title="Numérotation des virements"
                    description="Le prochain numéro sera utilisé lors de la création du prochain ordre."
                >
                    <div className="settings-number-box">
                        <Input
                            label="Prochain numéro"
                            type="number"
                            min="1"
                            name="next_transfer_number"
                            value={
                                settings.next_transfer_number || 1
                            }
                            onChange={handleChange}
                        />

                        <div className="settings-reference-preview">
                            <span>Prochaine référence</span>

                            <strong>
                                {String(
                                    settings.next_transfer_number || 1
                                ).padStart(6, '0')}
                            </strong>
                        </div>
                    </div>
                </Card>

                <Card
                    title="Configuration"
                    description="Informations techniques de l'application."
                >
                    <div className="settings-info-list">
                        <div>
                            <span>ID configuration</span>
                            <strong>{settings.id}</strong>
                        </div>

                        <div>
                            <span>Dernière modification</span>
                            <strong>
                                {settings.updated_at
                                    ? new Date(
                                          settings.updated_at
                                      ).toLocaleString('fr-FR')
                                    : '—'}
                            </strong>
                        </div>
                    </div>
                </Card>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}

export default Settings;