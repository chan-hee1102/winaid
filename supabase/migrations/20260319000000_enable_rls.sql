-- ============================================================
-- RLS Enable + Policy 설정
-- live_stocks, market_cache, stock_themes
-- ============================================================

-- ── live_stocks ──────────────────────────────────────────────
ALTER TABLE live_stocks ENABLE ROW LEVEL SECURITY;

-- 로그인 유저: SELECT
CREATE POLICY "live_stocks_select_authenticated"
  ON live_stocks
  FOR SELECT
  TO authenticated
  USING (true);

-- service_role: INSERT
CREATE POLICY "live_stocks_insert_service"
  ON live_stocks
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- service_role: UPDATE
CREATE POLICY "live_stocks_update_service"
  ON live_stocks
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- service_role: DELETE
CREATE POLICY "live_stocks_delete_service"
  ON live_stocks
  FOR DELETE
  TO service_role
  USING (true);


-- ── market_cache ─────────────────────────────────────────────
ALTER TABLE market_cache ENABLE ROW LEVEL SECURITY;

-- 로그인 유저: SELECT
CREATE POLICY "market_cache_select_authenticated"
  ON market_cache
  FOR SELECT
  TO authenticated
  USING (true);

-- service_role: INSERT
CREATE POLICY "market_cache_insert_service"
  ON market_cache
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- service_role: UPDATE
CREATE POLICY "market_cache_update_service"
  ON market_cache
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- service_role: DELETE
CREATE POLICY "market_cache_delete_service"
  ON market_cache
  FOR DELETE
  TO service_role
  USING (true);


-- ── stock_themes ─────────────────────────────────────────────
ALTER TABLE stock_themes ENABLE ROW LEVEL SECURITY;

-- 모든 유저(비로그인 포함): SELECT
CREATE POLICY "stock_themes_select_public"
  ON stock_themes
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- service_role: INSERT
CREATE POLICY "stock_themes_insert_service"
  ON stock_themes
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- service_role: UPDATE
CREATE POLICY "stock_themes_update_service"
  ON stock_themes
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- service_role: DELETE
CREATE POLICY "stock_themes_delete_service"
  ON stock_themes
  FOR DELETE
  TO service_role
  USING (true);
