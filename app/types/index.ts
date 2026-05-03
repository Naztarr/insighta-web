export interface Profile {
  id: string;
  name: string;
  gender: string;
  gender_probability: number; // mapped from @JsonProperty
  age: number;
  age_group: string;        // mapped from @JsonProperty
  country_id: string;       // mapped from @JsonProperty
  country_name: string;     // mapped from @JsonProperty
  country_probability: number; // mapped from @JsonProperty
  created_at: string;       // mapped from @JsonProperty
}

// Matches com.naz.profiler.dto.PageProfileResponse
export interface PageProfileResponse {
  status: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  links: {
    self: string;
    next: string | null;
    prev: string | null;
  };
  data: Profile[];
}