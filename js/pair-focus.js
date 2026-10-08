              <div>
                ${renderSectionHeader('7', isFr ? 'LECTURE COMMERCIALE' : 'COMMERCIAL READING', isFr ? 'Clés de lecture des évènements à venir' : 'Key takeaways for upcoming events')}
                <div style="display: flex; flex-direction: column; gap: 6px;">
                  ${(() => {
                    const events = (isFr ? pairData.toWatchFr : pairData.toWatchEn).filter(w => w && w.isObj).slice(0, 3);
                    if (events.length > 0) {
                      return events.map(w => `
                        <div style="background: #f8fafc; border-left: 3px solid ${w.impact === 'High' ? '#dc2626' : '#ea580c'}; padding: 6px 10px; border-radius: 0 4px 4px 0; margin-bottom: 4px;">
                          <div style="font-size: 8.5px; font-weight: 700; color: #1e293b; margin-bottom: 2px;">
                            ${w.title}
                          </div>
                          <div style="font-size: 8px; color: #475569; line-height: 1.3;">
                            ${getEventReading(w.country, w.title, isFr)}
                          </div>
                        </div>
                      `).join('');
                    } else {
                      return `
                        <div style="background: #f0fdf4; border-left: 3px solid #16a34a; padding: 8px 10px; border-radius: 0 4px 4px 0; margin-bottom: 6px;">
                          <div style="font-size: 9.5px; font-weight: 700; color: #166534;">${isFr ? 'Vendeur de devises (USD)' : 'Currency Seller (USD)'}</div>
                          <div style="font-size: 8.5px; color: #334155; margin-top: 2px;">${inject(isFr ? pairData.commercialReading.sellerFr : pairData.commercialReading.sellerEn)}</div>
                        </div>
                        <div style="background: #fef2f2; border-left: 3px solid #dc2626; padding: 8px 10px; border-radius: 0 4px 4px 0;">
                          <div style="font-size: 9.5px; font-weight: 700; color: #991b1b;">${isFr ? 'Acheteur de devises' : 'Currency Buyer'}</div>
                          <div style="font-size: 8.5px; color: #334155; margin-top: 2px;">${inject(isFr ? pairData.commercialReading.buyerFr : pairData.commercialReading.buyerEn)}</div>
                        </div>
                      `;
                    }
                  })()}
                </div>
              </div>