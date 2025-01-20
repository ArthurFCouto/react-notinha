class RecordSet<T> {
  totalDeRegistros: number;
  pagina: number;
  quantidadePorPagina: number;
  resultados: T[];
  mensagemDeErro?: string;
  mensagemDeSucesso?: string;

  constructor(
    totalDeRegistros: number,
    pagina: number,
    quantidadePorPagina: number,
    resultados: T[],
    mensagemDeErro?: string,
    mensagemDeSucesso?: string
  ) {
    this.totalDeRegistros = totalDeRegistros;
    this.pagina = pagina;
    this.quantidadePorPagina = quantidadePorPagina;
    this.resultados = resultados;
    this.mensagemDeErro = mensagemDeErro;
    this.mensagemDeSucesso = mensagemDeSucesso;
  }

  static Mapping<T>(data: {
    totalDeRegistros: number;
    pagina: number;
    quantidadePorPagina: number;
    resultados: T[];
    mensagemDeSucesso?: string;
    mensagemDeErro?: string;
  }): RecordSet<T> {
    return new RecordSet(
      data.totalDeRegistros,
      data.pagina,
      data.quantidadePorPagina,
      data.resultados,
      data.mensagemDeSucesso,
      data.mensagemDeErro
    );
  }
}

export default RecordSet;
