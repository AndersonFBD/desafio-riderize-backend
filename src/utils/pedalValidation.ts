interface pedalData {
  start_date: string;
  start_date_registration: string;
  end_date_registration: string;
  participants_limit: number;
}

export default function validarCreatePedal(data: pedalData) {
  const startDate = new Date(data.start_date);
  const startDateRegistration = new Date(data.start_date_registration);
  const endDateRegistration = new Date(data.end_date_registration);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  startDateRegistration.setHours(0, 0, 0, 0);
  endDateRegistration.setHours(0, 0, 0, 0);

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
  if (data.participants_limit !== null && data.participants_limit <= 0) {
    throw new Error("O limite de participantes deve ser um número positivo");
  }
}
