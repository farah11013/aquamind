-- Drop existing INSERT policy
DROP POLICY IF EXISTS "Users can create identifications" ON fish_identifications;

-- Create new INSERT policy that allows both authenticated and anonymous users
CREATE POLICY "Anyone can create identifications"
ON fish_identifications
FOR INSERT
TO public
WITH CHECK (true);

-- Also ensure authenticated users can insert their own records
CREATE POLICY "Authenticated users can create their identifications"
ON fish_identifications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);