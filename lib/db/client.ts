'use client';

import { createClientComponentClient as _createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const createClientComponentClient = _createClientComponentClient<Database>;
