-- CreateIndex
CREATE INDEX "Property_city_idx" ON "Property"("city");

-- CreateIndex
CREATE INDEX "Property_zipCode_idx" ON "Property"("zipCode");

-- CreateIndex
CREATE INDEX "Property_state_idx" ON "Property"("state");

-- CreateIndex
CREATE INDEX "property_created_at_desc_idx" ON "Property"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "property_created_at_asc_idx" ON "Property"("createdAt" ASC);
