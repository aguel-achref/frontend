import { useEffect, useState } from "react";

import PageHeader from "../../components/layout/PageHeader";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import Toast from "../../components/ui/Toast";

import TransferForm from "../../components/transfers/TransferForm";
import TransferFilters from "../../components/transfers/TransferFilters";
import TransferSummary from "../../components/transfers/TransferSummary";
import TransferTable from "../../components/transfers/TransferTable";

import PrintPreview from "../../print/PrintPreview";

import { getBanks } from "../../api/bank.api";

import { getBeneficiaries } from "../../api/beneficiary.api";

import { getSettings } from "../../api/settings.api";

import {
  getTransfers,
  getOneTransfer,
  createTransfer,
  deleteTransfer,
} from "../../api/transfer.api";

function Transfers() {
  /* =========================================================
       DATA
       ========================================================= */

  const [banks, setBanks] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [settings, setSettings] = useState(null);

  /* =========================================================
       LOADING
       ========================================================= */

  const [loading, setLoading] = useState(true);
  const [transfersLoading, setTransfersLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  /* =========================================================
       MODALS
       ========================================================= */

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const [printModalOpen, setPrintModalOpen] = useState(false);

  /* =========================================================
       SELECTED TRANSFER
       ========================================================= */

  const [selectedTransfer, setSelectedTransfer] = useState(null);

  const [selectedBank, setSelectedBank] = useState(null);

  /* =========================================================
       FILTERS
       ========================================================= */

  const [filters, setFilters] = useState({
    year: "",
    bank_id: "",
    search: "",
  });

  /* =========================================================
       TOAST
       ========================================================= */

  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });
  };

  /* =========================================================
       LOAD INITIAL DATA
       ========================================================= */

  const loadInitialData = async () => {
    try {
      setLoading(true);

      const [banksResponse, beneficiariesResponse, settingsResponse] =
        await Promise.all([getBanks(), getBeneficiaries(), getSettings()]);

      if (banksResponse.success) {
        setBanks(banksResponse.data || []);
      } else {
        showToast(
          banksResponse.error || "Impossible de charger les banques.",
          "error",
        );
      }

      if (beneficiariesResponse.success) {
        setBeneficiaries(beneficiariesResponse.data || []);
      } else {
        showToast(
          beneficiariesResponse.error ||
            "Impossible de charger les bénéficiaires.",
          "error",
        );
      }

      if (settingsResponse.success) {
        setSettings(settingsResponse.data || null);
      } else {
        showToast(
          settingsResponse.error || "Impossible de charger les paramètres.",
          "error",
        );
      }
    } catch (error) {
      console.error("Error loading transfer page:", error);

      showToast(
        error.response?.data?.error || "Erreur lors du chargement des données.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
       LOAD TRANSFERS
       ========================================================= */

  const loadTransfers = async () => {
    try {
      setTransfersLoading(true);

      const params = {};

      if (filters.year) {
        params.year = filters.year;
      }

      if (filters.bank_id) {
        params.bank_id = filters.bank_id;
      }

      if (filters.search?.trim()) {
        params.search = filters.search.trim();
      }

      const response = await getTransfers(params);

      if (response.success) {
        setTransfers(response.data || []);
      } else {
        showToast(
          response.error || "Impossible de charger l’historique.",
          "error",
        );
      }
    } catch (error) {
      console.error("Error loading transfers:", error);

      showToast(
        error.response?.data?.error ||
          "Erreur lors du chargement des virements.",
        "error",
      );
    } finally {
      setTransfersLoading(false);
    }
  };

  /* =========================================================
       INITIAL LOAD
       ========================================================= */

  useEffect(() => {
    loadInitialData();
  }, []);

  /* =========================================================
       LOAD TRANSFERS WHEN FILTERS CHANGE
       ========================================================= */

  useEffect(() => {
    if (!loading) {
      loadTransfers();
    }
  }, [filters.year, filters.bank_id, filters.search, loading]);

  /* =========================================================
       FILTER HANDLER
       ========================================================= */

  const handleFiltersChange = (nextFilters) => {
    setFilters(nextFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      year: "",
      bank_id: "",
      search: "",
    });
  };

  /* =========================================================
       CREATE TRANSFER
       ========================================================= */

  const handleCreateTransfer = async (payload) => {
    try {
      setCreating(true);

      const response = await createTransfer(payload);

      if (!response.success) {
        showToast(
          response.error || "Impossible de créer le virement.",
          "error",
        );

        return;
      }

      await loadTransfers();

      setCreateModalOpen(false);

      showToast(response.message || "Virement créé avec succès.", "success");
    } catch (error) {
      console.error("Error creating transfer:", error);

      showToast(
        error.response?.data?.error ||
          "Erreur lors de la création du virement.",
        "error",
      );
    } finally {
      setCreating(false);
    }
  };

  /* =========================================================
       DELETE TRANSFER
       ========================================================= */

  const handleDeleteTransfer = async (transfer) => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le virement ${transfer.reference} ?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await deleteTransfer(transfer.id);

      if (!response.success) {
        showToast(
          response.error || "Impossible de supprimer le virement.",
          "error",
        );

        return;
      }

      await loadTransfers();

      showToast("Virement supprimé avec succès.", "success");
    } catch (error) {
      console.error("Error deleting transfer:", error);

      showToast(
        error.response?.data?.error ||
          "Erreur lors de la suppression du virement.",
        "error",
      );
    }
  };

  /* =========================================================
       GET BANK FOR TRANSFER
       ========================================================= */

  const findBankForTransfer = (transfer) => {
    if (!transfer) {
      return null;
    }

    return (
      banks.find((bank) => Number(bank.id) === Number(transfer.bank_id)) || null
    );
  };

  /* =========================================================
       OPEN DETAILS
       ========================================================= */

  const handleViewTransfer = async (transfer) => {
    try {
      setDetailsLoading(true);

      setDetailsModalOpen(true);

      const response = await getOneTransfer(transfer.id);

      if (!response.success) {
        showToast(
          response.error || "Impossible de charger le virement.",
          "error",
        );

        setDetailsModalOpen(false);

        return;
      }

      const completeTransfer = response.data;

      setSelectedTransfer(completeTransfer);

      setSelectedBank(findBankForTransfer(completeTransfer));
    } catch (error) {
      console.error("Error loading transfer:", error);

      showToast(
        error.response?.data?.error || "Erreur lors du chargement du virement.",
        "error",
      );

      setDetailsModalOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  /* =========================================================
       CLOSE DETAILS
       ========================================================= */

  const closeDetailsModal = () => {
    if (detailsLoading) {
      return;
    }

    setDetailsModalOpen(false);
    setSelectedTransfer(null);
    setSelectedBank(null);
  };

  /* =========================================================
       OPEN PRINT
       ========================================================= */

  const handleOpenPrint = () => {
    if (!selectedTransfer) {
      showToast("Aucun virement sélectionné.", "error");

      return;
    }

    const bank = selectedBank || findBankForTransfer(selectedTransfer);

    if (!bank) {
      showToast("Impossible de déterminer la banque du virement.", "error");

      return;
    }

    setSelectedBank(bank);

    setPrintModalOpen(true);
  };

  /* =========================================================
       CLOSE PRINT
       ========================================================= */

  const handleClosePrint = () => {
    setPrintModalOpen(false);
  };

  /* =========================================================
       PRINT DOCUMENT
       ========================================================= */

  const handlePrint = () => {
    window.print();
  };

  /* =========================================================
       DUPLICATE TRANSFER
       ========================================================= */

  const handleDuplicateTransfer = () => {
    if (!selectedTransfer) {
      return;
    }

    setDetailsModalOpen(false);

    setCreateModalOpen(true);

    showToast(
      "Vous pouvez créer un nouveau virement à partir des informations précédentes.",
      "info",
    );
  };

  /* =========================================================
       STATISTICS
       ========================================================= */

  const totalTransfers = transfers.length;

  const totalAmount = transfers.reduce(
    (total, transfer) => total + Number(transfer.amount || 0),
    0,
  );

  const activeBanks = banks.filter((bank) => Boolean(bank.is_active)).length;

  const beneficiaryCount = beneficiaries.length;

  /* =========================================================
       RENDER
       ========================================================= */

  return (
    <div className="page transfers-page">
      <PageHeader
        title="Virements"
        description="Créez, consultez et imprimez vos ordres de virement."
        actions={
          <Button onClick={() => setCreateModalOpen(true)}>
            + Nouveau virement
          </Button>
        }
      />

      {/* =================================================
                MINI STATS
                ================================================= */}

      <div className="transfer-page-stats">
        <div className="transfer-mini-stat">
          <span>Virements affichés</span>

          <strong>{totalTransfers}</strong>
        </div>

        <div className="transfer-mini-stat">
          <span>Montant total</span>

          <strong>
            {totalAmount.toLocaleString("fr-FR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </strong>
        </div>

        <div className="transfer-mini-stat">
          <span>Banques actives</span>

          <strong>{activeBanks}</strong>
        </div>

        <div className="transfer-mini-stat">
          <span>Bénéficiaires</span>

          <strong>{beneficiaryCount}</strong>
        </div>
      </div>

      {/* =================================================
                HISTORY
                ================================================= */}

      <Card
        title="Historique des virements"
        description="Consultez et recherchez les virements enregistrés."
      >
        <TransferFilters
          filters={filters}
          banks={banks}
          onChange={handleFiltersChange}
          onReset={handleResetFilters}
        />

        <TransferTable
          transfers={transfers}
          loading={transfersLoading}
          onView={handleViewTransfer}
          onDelete={handleDeleteTransfer}
        />
      </Card>

      {/* =================================================
                CREATE MODAL
                ================================================= */}

      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Nouveau virement"
        description="Saisissez les informations du nouvel ordre de virement."
        size="large"
      >
        <TransferForm
          banks={banks}
          beneficiaries={beneficiaries}
          onSubmit={handleCreateTransfer}
          loading={creating}
          onCancel={() => setCreateModalOpen(false)}
        />
      </Modal>

      {/* =================================================
                DETAILS MODAL
                ================================================= */}

      <Modal
        open={detailsModalOpen}
        onClose={closeDetailsModal}
        title={
          selectedTransfer
            ? `Virement ${selectedTransfer.reference}`
            : "Détails du virement"
        }
        description="Consultez les informations complètes du virement."
        size="large"
      >
        {detailsLoading ? (
          <div className="operation-overlay">
            <div className="operation-loader">
              <div className="loading-spinner" />

              <span>Chargement du virement...</span>
            </div>
          </div>
        ) : selectedTransfer ? (
          <>
            <TransferSummary transfer={selectedTransfer} bank={selectedBank} />

            <div className="transfer-details-actions">
              <Button variant="secondary" onClick={handleDuplicateTransfer}>
                Dupliquer
              </Button>

              <Button variant="secondary" onClick={handleOpenPrint}>
                Aperçu / Imprimer
              </Button>

              <Button
                variant="danger"
                onClick={() => {
                  handleDeleteTransfer(selectedTransfer);

                  closeDetailsModal();
                }}
              >
                Supprimer
              </Button>
            </div>
          </>
        ) : null}
      </Modal>

      {/* =================================================
                PRINT MODAL
                ================================================= */}

      <Modal
        open={printModalOpen}
        onClose={handleClosePrint}
        title={
          selectedTransfer
            ? `Impression — ${selectedTransfer.reference}`
            : "Impression"
        }
        description={
          selectedBank ? `Modèle : ${selectedBank.template || "GENERIC"}` : ""
        }
        size="large"
      >
        {selectedTransfer && selectedBank ? (
          <>
            <div className="print-preview-toolbar">
              <div>
                <strong>Aperçu du document</strong>

                <span>
                  {selectedBank.name} — {selectedBank.template}
                </span>
              </div>

              <div>
                <Button variant="secondary" onClick={handleClosePrint}>
                  Fermer
                </Button>

                <Button onClick={handlePrint}>Imprimer</Button>
              </div>
            </div>

            <div id="print-root" className="print-preview-container">
              <PrintPreview
                transfer={selectedTransfer}
                bank={selectedBank}
                settings={settings}
              />
            </div>
          </>
        ) : (
          <div className="empty-state">
            <h3>Document indisponible</h3>

            <p>
              Les informations nécessaires à l'impression ne sont pas
              disponibles.
            </p>
          </div>
        )}
      </Modal>

      {/* =================================================
                TOAST
                ================================================= */}

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

export default Transfers;
