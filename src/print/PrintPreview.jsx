import GenericTransferPrint from './GenericTransferPrint';
import BiatTransferPrint from './BiatTransferPrint';
import AttijariTransferPrint from './AttijariTransferPrint';

function PrintPreview({
    transfer,
    bank,
    settings,
}) {
    if (!transfer || !bank) {
        return null;
    }

    const template = bank.template || 'GENERIC';

    if (template === 'BIAT') {
        return (
            <BiatTransferPrint
                transfer={transfer}
                bank={bank}
                settings={settings}
            />
        );
    }

    if (template === 'ATTIJARI') {
        return (
            <AttijariTransferPrint
                transfer={transfer}
                bank={bank}
                settings={settings}
            />
        );
    }

    return (
        <GenericTransferPrint
            transfer={transfer}
            bank={bank}
            settings={settings}
        />
    );
}

export default PrintPreview;