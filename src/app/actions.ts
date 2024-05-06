'use server'
import axios from 'axios';
import jsdom from 'jsdom';

export async function createPrices(url: string) {
    const { JSDOM } = jsdom;
    try {
        const response = await axios.get(url);
        const { data } = response;
        //const parse = new DOMParser();
        // Transforma  uma string com código html em um documento manipulável
        //const virtualDoc = parse.parseFromString(data, 'text/html');
        const virtualDoc = new JSDOM(data);
        // Encontrando a tabela que contém a lista dos produtos
        const tabela = virtualDoc.window.document.querySelector('.table.table-striped');
        // Verificar se a tabela foi encontrada
        if (tabela) {
            HandleCNPJ(virtualDoc.window.document);
            HandleNF(virtualDoc.window.document);
            // Objeto para armazenar os objetos únicos
            const objetosUnicos: any = {};
            // Iterar sobre as linhas da tabela
            const linhas = tabela.querySelectorAll('tbody tr');
            linhas.forEach((linha) => {
                // Iterar sobre as colunas da linha
                const dados: NodeListOf<HTMLTableCellElement> = linha.querySelectorAll('td');
                // Limpar e converter quantidade para número
                const quantidade = parseFloat(dados[1].textContent.trim().replace(/[^\d.,]/g, '').replace(',', '.'));
                // Limpar e converter valorTotal para número
                const valorTotal = parseFloat(dados[3].textContent.trim().replace(/[^\d.,]/g, '').replace(',', '.'));
                // Criar chave única para o objeto
                const chave = dados[0].textContent.trim() + '_' + quantidade + '_' + valorTotal;
                // Verificar se o objeto já existe no objetoUnicos
                if (!objetosUnicos[chave]) {
                    // Criar objeto para a linha e armazenar em objetosUnicos
                    objetosUnicos[chave] = {
                        produto: dados[0].querySelector('h7').textContent.trim(),
                        quantidade: quantidade,
                        unidade: dados[2].textContent.trim().slice(4),
                        valorTotal: valorTotal
                    };
                }
            });
            // Converter objetosUnicos de volta para um array
            const objetos = Object.values(objetosUnicos);
            // Exibir o array de objetos no console
            console.log('Objetos:', objetos);
        } else {
            console.error('Tabela não encontrada. Favor rever o HTML da página original.');
        }

    } catch (error) {
        console.error('Erro na requisição do PortalNF', error);
    }
}

async function getDetailsCNPJ(cnpj: string) {
    const response = await axios.get(`https://receitaws.com.br/v1/cnpj/${cnpj.replace(/[^\d]/g, '')}`);
    const { data } = response;
    const market = {
        CNPJ: cnpj,
        CEP: data.cep,
        endereco: data.logradouro,
        numero: data.numero,
        razaoSocial: data.nome,
        nomeFantasia: data.fantasia,
        UF: data.uf,
        cidade: data.municipio,
        bairro: data.bairro
    }
    console.log('Market', market);
};

function HandleCNPJ(doc: Document) {
    const element = doc.querySelector('tbody tr:first-of-type td') as HTMLElement;
    const allText = String(element.textContent);
    const limiter = allText.indexOf(',');
    const cnpj = allText.slice(0, limiter);
    getDetailsCNPJ(cnpj);
}

function HandleNF(doc: Document) {
    let element = doc.getElementById('collapseTwo') as HTMLElement;
    const key = element.querySelector('table tbody tr:first-of-type td')?.textContent;
    element = doc.getElementById('collapse4') as HTMLElement;
    const table = element.querySelector('table:nth-child(8)') as Element;
    const line = table.querySelector('tbody tr') as Element;
    const columns = line.querySelectorAll('td');
    const serie = columns[1].textContent || 'N/A';
    const numero = columns[2].textContent || 'N/A';
    const data = columns[3].textContent || 'N/A';
    console.log('NF', {
        CNPJ: 'N/A',
        key,
        serie,
        numero,
        data,
        url: 'N/A'
    });
}