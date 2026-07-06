const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function getProperties(paramsObj: any = {}) {
  let url = `${API_URL}/api/properties`;
  const params = new URLSearchParams();
  
  if (paramsObj.location) params.append('location', paramsObj.location);
  if (paramsObj.type) params.append('type', paramsObj.type);
  if (paramsObj.maxPrice) params.append('maxPrice', paramsObj.maxPrice);
  if (paramsObj.beds) params.append('beds', paramsObj.beds);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch properties');
  return res.json();
}

export async function getFeaturedProperties() {
  const res = await fetch(`${API_URL}/api/properties/featured`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch featured properties');
  return res.json();
}

export async function getPropertyById(id: string) {
  const res = await fetch(`${API_URL}/api/properties/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch property');
  return res.json();
}

export async function getTestimonials() {
  const res = await fetch(`${API_URL}/api/testimonials`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch testimonials');
  return res.json();
}

export async function submitInquiry(data: any) {
  const res = await fetch(`${API_URL}/api/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to submit inquiry');
  return res.json();
}
