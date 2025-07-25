interface pedalData {
  start_date: string;
  start_date_registration: string;
  end_date_registration: string;
  participants_limit: number;
}

// função que verifica o formato da data
function validarData(dateStr: string): boolean {
  const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  if (!regex.test(dateStr)) return false;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;
  return date.toISOString().slice(0, 10) === dateStr;
}

//normalizar as datas para validar corretamente
function normalizarDatas(date: Date): Date {
  date.setHours(0, 0, 0, 0);
  return date;
}

export default function validarCreatePedal(data: pedalData) {
  if (
    !validarData(data.start_date_registration) ||
    !validarData(data.end_date_registration) ||
    !validarData(data.start_date)
  )
    throw new Error("As datas precisam ser válidas e no formato YYYY-MM-DD");

  const startDate = new Date(data.start_date);
  const startDateRegistration = new Date(data.start_date_registration);
  const endDateRegistration = new Date(data.end_date_registration);
  const today = new Date();

  //   normalizar as data recebidas
  normalizarDatas(today);
  normalizarDatas(startDateRegistration);
  normalizarDatas(endDateRegistration);
  normalizarDatas(startDate);

  // validações de datas
  if (endDateRegistration <= startDateRegistration) {
    throw new Error(
      "A data de encerramento da inscrição deve ser posterior à data de início das inscrições"
    );
  }
  //   inscrições não podem começar pela data de hoje, TODO: identificar essa limitação depois
  if (startDateRegistration < today) {
    throw new Error("A data de início da inscrição deve ser futura");
  }
  if (startDate <= today) {
    throw new Error("A data de início do pedal deve ser futura");
  }
  if (startDate <= endDateRegistration) {
    throw new Error(
      "O pedal só pode iniciar depois que as inscrições encerrarem"
    );
  }

  // validação de limite de participantes

  //   valor nulo
  if (!data.participants_limit) {
    throw new Error("numero de participantes é obrigatório");
  }

  //   numero de participantes positivo
  if (data.participants_limit != null && data.participants_limit <= 0) {
    throw new Error("O limite de participantes deve ser um número positivo");
  }
}
