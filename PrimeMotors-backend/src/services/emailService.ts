interface ProposalEmailPayload {
  event: "proposal.created";
  data: {
    proposal: {
      id: string;
      offeredValue: string;
      message: string | null;
      status: string;
      createdAt: string;
    };
    user: {
      id: string;
      name: string;
      email: string;
    };
    car: {
      id: string;
      name: string;
      value: string;
    };
  };
}

const emailService = {
  async sendProposalCreated(
    payload: ProposalEmailPayload,
  ): Promise<void> {
    const baseUrl = process.env.EMAIL_SERVICE_URL;
    const token = process.env.EMAIL_SERVICE_TOKEN;

    if (!baseUrl || !token) {
      throw new Error(
        "Configuração do microserviço de e-mail ausente.",
      );
    }

    const response = await fetch(
      `${baseUrl.replace(/\/$/, "")}/emails/proposal-created`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-service-token": token,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Microserviço de e-mail respondeu com HTTP ${response.status}.`,
      );
    }
  },
};

export default emailService;