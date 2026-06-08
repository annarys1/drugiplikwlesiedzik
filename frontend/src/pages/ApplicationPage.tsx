import ApplicationWizard from '../components/ApplicationWizard';

export default function ApplicationPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Nowy wniosek rekrutacyjny</h1>
        <p className="text-gray-500 mt-1 text-sm">Wypełnij formularz, aby złożyć wniosek o przyjęcie dziecka do placówki w gminie Biskupice.</p>
      </div>
      <ApplicationWizard />
    </div>
  );
}
