import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

function TransferFilters({
    filters,
    onChange,
    onReset,
    banks = [],
}) {
    const currentYear =
        new Date().getFullYear();

    const years = [];

    for (
        let year = currentYear;
        year >= currentYear - 5;
        year--
    ) {
        years.push({
            value: year,
            label: String(year),
        });
    }

    const bankOptions = banks.map(
        (bank) => ({
            value: bank.id,
            label: bank.name,
        })
    );

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        onChange({
            ...filters,
            [name]: value,
        });
    };

    return (
        <Card
            className="filters-card"
            title="Filtres"
            description="Filtrez l'historique des virements."
        >
            <div className="filters-grid">
                <Select
                    label="Année"
                    name="year"
                    value={
                        filters.year || ''
                    }
                    onChange={handleChange}
                    options={years}
                    placeholder="Toutes les années"
                />

                <Select
                    label="Banque"
                    name="bank_id"
                    value={
                        filters.bank_id || ''
                    }
                    onChange={handleChange}
                    options={bankOptions}
                    placeholder="Toutes les banques"
                />

                <Input
                    label="Recherche"
                    name="search"
                    value={
                        filters.search || ''
                    }
                    onChange={handleChange}
                    placeholder="Référence, bénéficiaire..."
                />

                <div className="filters-actions">
                    <Button
                        variant="secondary"
                        onClick={onReset}
                    >
                        Réinitialiser
                    </Button>
                </div>
            </div>
        </Card>
    );
}

export default TransferFilters;