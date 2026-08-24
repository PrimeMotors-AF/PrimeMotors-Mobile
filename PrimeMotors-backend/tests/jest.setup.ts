// Tudo aqui rodará ANTES de cada arquivo de teste
beforeAll(() => {
  console.log("Iniciando a suíte de testes...");
});

afterEach(() => {
  jest.clearAllMocks(); 
});