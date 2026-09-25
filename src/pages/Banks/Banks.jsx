import { useEffect, useMemo, useState } from "react";

import PageHeader from "../../components/layout/PageHeader";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import Toast from "../../components/ui/Toast";
import Input from "../../components/ui/Input";

import BankForm from "../../components/banks/BankForm";
import BankTable from "../../components/banks/BankTable";

import {
  getBanks,
  createBank,
  updateBank,
  deleteBank,
} from "../../api/bank.api";

function Banks() {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });
  };

  const loadBanks = async () => {
    try {
      setLoading(true);

      const response = await getBanks();

      if (response.success) {
        setBanks(response.data || []);
      } else {
        showToast(
          response.error || "Impossible de charger les banques.",
          "error",
        );
      }
    } catch (error) {
      console.error(error);

      showToast(
        error.response?.data?.error || "Erreur lors du chargement des banques.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanks();
  }, []);

  const filteredBanks = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return banks;
    }

    return banks.filter((bank) =>
      [bank.code, bank.name, bank.account, bank.template, bank.form_number]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(value)),
    );
  }, [banks, search]);

  const openCreateModal = () => {
    setSelectedBank(null);
    setModalOpen(true);
  };

  const openEditModal = (bank) => {
    setSelectedBank(bank);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setSelectedBank(null);
  };

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);

      let response;

      if (selectedBank) {
        response = await updateBank(selectedBank.id, payload);
      } else {
        response = await createBank(payload);
      }

      if (!response.success) {
        showToast(response.error || "Une erreur est survenue.", "error");

        return;
      }

      await loadBanks();

      setModalOpen(false);
      setSelectedBank(null);

      showToast(
        selectedBank
          ? "Banque modifiée avec succès."
          : "Banque créée avec succès.",
        "success",
      );
    } catch (error) {
      console.error(error);

      showToast(
        error.response?.data?.error || "Impossible d’enregistrer la banque.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (bank) => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer la banque "${bank.name}" ?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await deleteBank(bank.id);

      if (!response.success) {
        showToast(
          response.error || "Impossible de supprimer la banque.",
          "error",
        );

        return;
      }

      await loadBanks();

      showToast("Banque supprimée avec succès.", "success");
    } catch (error) {
      console.error(error);

      showToast(
        error.response?.data?.error || "Erreur lors de la suppression.",
        "error",
      );
    }
  };

  const activeCount = banks.filter((bank) => Boolean(bank.is_active)).length;

  return (
    <div className="page banks-page">
      <PageHeader
        title="Banques"
        description="Gérez les banques émettrices disponibles pour vos virements."
        actions={<Button onClick={openCreateModal}>+ Nouvelle banque</Button>}
      />

      <div className="bank-stats">
        <div className="bank-stat-card">
          <span>Total banques</span>
          <strong>{banks.length}</strong>
        </div>

        <div className="bank-stat-card">
          <span>Banques actives</span>
          <strong>{activeCount}</strong>
        </div>

        <div className="bank-stat-card">
          <span>Résultats affichés</span>
          <strong>{filteredBanks.length}</strong>
        </div>
      </div>

      <Card
        title="Liste des banques"
        description="Configurez les banques utilisées par l'application."
      >
        <div className="bank-toolbar">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher une banque, un code..."
          />

          {search && (
            <Button variant="secondary" onClick={() => setSearch("")}>
              Réinitialiser
            </Button>
          )}
        </div>

        <BankTable
          banks={filteredBanks}
          loading={loading}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      </Card>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={selectedBank ? "Modifier la banque" : "Nouvelle banque"}
        description={
          selectedBank
            ? "Modifiez la configuration de cette banque."
            : "Ajoutez une nouvelle banque émettrice."
        }
        size="large"
      >
        <BankForm
          bank={selectedBank}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
        />
      </Modal>

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

export default Banks;
