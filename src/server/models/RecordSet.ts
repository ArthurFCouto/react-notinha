class RecordSet<T> {
  totalDeRegistros: number;
  pagina: number;
  quantidadePorPagina: number;
  resultado: T[];
  mensagemDeErro?: string;
  mensagemDeSucesso?: string;

  constructor(
    totalDeRegistros: number,
    pagina: number,
    quantidadePorPagina: number,
    resultado: T[],
    mensagemDeErro?: string,
    mensagemDeSucesso?: string
  ) {
    this.totalDeRegistros = totalDeRegistros;
    this.pagina = pagina;
    this.quantidadePorPagina = quantidadePorPagina;
    this.resultado = resultado;
    this.mensagemDeErro = mensagemDeErro;
    this.mensagemDeSucesso = mensagemDeSucesso;
  }

  static Mapping<T>(data: {
    totalDeRegistros: number;
    pagina: number;
    quantidadePorPagina: number;
    resultado: T[];
    mensagemDeSucesso?: string;
    mensagemDeErro?: string;
  }): RecordSet<T> {
    return new RecordSet(
      data.totalDeRegistros,
      data.pagina,
      data.quantidadePorPagina,
      data.resultado,
      data.mensagemDeSucesso,
      data.mensagemDeErro
    );
  }
}

export default RecordSet;
