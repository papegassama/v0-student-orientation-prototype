-- Update quiz_results table to support direct result storage without orientation_id dependency
ALTER TABLE quiz_results 
  DROP CONSTRAINT IF EXISTS quiz_results_orientation_id_fkey;

ALTER TABLE quiz_results 
  ALTER COLUMN orientation_id DROP NOT NULL,
  ADD COLUMN answers JSONB,
  ADD COLUMN recommendations JSONB;

-- Drop old columns if they don't match our needs
-- top_categories can be derived from recommendations

COMMENT ON TABLE quiz_results IS 'Stores quiz results for users with their answers and recommendations';
COMMENT ON COLUMN quiz_results.user_id IS 'References the user who took the quiz';
COMMENT ON COLUMN quiz_results.answers IS 'JSON object of question answers';
COMMENT ON COLUMN quiz_results.recommendations IS 'Array of recommended programs/paths with scores';
