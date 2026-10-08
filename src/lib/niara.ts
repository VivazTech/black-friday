const NIARA = {
  url: "https://reservas.vivazcataratas.com.br/hotels/HOTEL_OMNI_2642",
  clientId: "b5ed74a2-146b-453d-899d-b31cb9c9ec09",
  clientName: "Motor Niara",
  destinationName: "Vivaz Cataratas Resort",
  hotelId: "HOTEL_OMNI_2642",
  propertyId: "80173d44-ef09-4600-9e4d-4ceb9a53885b",
};

function roomCode(adults: number, childAges: number[]) {
  const code = `a${adults}`;
  return childAges.length > 0 ? `${code}c${childAges.join(",")}` : code;
}

/** Mesma URL de reserva usada pelo calendário da Semana Vivaz. */
export function niaraUrl(input: {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  childAges: number[];
  rooms: number;
  promoCode: string;
}) {
  const params = [`adults=${input.adults}`, `children=${input.children}`];
  for (const age of input.childAges) params.push(`childrenAges[]=${age}`);
  params.push(`clientId=${NIARA.clientId}`);
  params.push(`clientName=${encodeURIComponent(NIARA.clientName)}`);
  params.push("contentType=property");
  params.push("destinationCountry=BR");
  params.push(`destinationName=${encodeURIComponent(NIARA.destinationName)}`);
  params.push("enablePromoCode=true");
  params.push(`endDate=${input.checkOut}`);
  params.push(`hotelIds[]=${encodeURIComponent(NIARA.hotelId)}`);
  params.push("personName=");
  if (input.promoCode) params.push(`promoCode=${encodeURIComponent(input.promoCode)}`);
  params.push(`propertyId=${NIARA.propertyId}`);

  if (input.rooms > 1) {
    const firstRoomAdults = Math.max(1, input.adults - (input.rooms - 1));
    params.push(`rooms[]=${encodeURIComponent(roomCode(firstRoomAdults, input.childAges))}`);
    for (let room = 1; room < input.rooms; room += 1) {
      params.push(`rooms[]=${encodeURIComponent(roomCode(1, []))}`);
    }
  } else {
    params.push(`rooms[]=${encodeURIComponent(roomCode(input.adults, input.childAges))}`);
  }

  params.push(`startDate=${input.checkIn}`);
  return `${NIARA.url}#${params.join("&")}`;
}
