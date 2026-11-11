## Gap
The repository has an automatic Pages deployment workflow, but the launch handover still needs explicit monitoring and recovery ownership.

## Acceptance criteria
- [ ] Name the business owner for website/domain renewals, deployments and receiving enquiries.
- [ ] Configure deployment-failure notifications and an availability check for the public homepage/contact/planner pages.
- [ ] Define how missing enquiries and sending-service errors are detected once direct delivery is enabled.
- [ ] Document how to restore a known working deployment/commit and verify the public result.
- [ ] Record the production domain, hosting choice and normal release checks in the repository documentation.
- [ ] Document where source and approved business media are backed up.
- [ ] Keep account keys and customer information outside public issues and source control.
- [ ] Run an owner-approved end-to-end enquiry test after changes to domain, hosting or email configuration.

Related: #2, #9 and #13. Existing Pages CI tests are useful but do not prove mailbox delivery or establish operating ownership.
