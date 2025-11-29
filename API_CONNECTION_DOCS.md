# API Connection Test Environment Documentation

## Overview
This document outlines the configuration required to connect the Drug Interaction Checker application to the ORCA (Japan Medical Association Standard Receipt Software) API `ORAPI021R4V2`.

**⚖️ Legal Compliance**: This application uses ORCA master data in accordance with the **Japan Medical Association Open Source License Agreement (Version 1.0)**, specifically Chapter 3 regarding Master Data Usage.

## Environment Variables
The application uses the following environment variables to configure the ORCA API connection. These should be set in the backend environment (e.g., `.env` file or system environment variables).

| Variable | Description | Default |
| :--- | :--- | :--- |
| `ORCA_API_URL` | The full URL to the ORCA interaction check endpoint. | `http://localhost:8000/api01/rv2/interaction_check` |
| `ORCA_USER` | Basic Auth Username for ORCA API. | `ormaster` |
| `ORCA_PASSWORD` | Basic Auth Password for ORCA API. | `password` |
| `DUMMY_PATIENT_ID` | The Patient ID to use for generic checks. | `99999999` |
| `ORCA_MOCK_MODE` | Set to `true` to use internal mock logic (no network call). | `true` |

**📝 Note**: Copy `backend/.env.example` to `backend/.env` and configure with your actual ORCA server credentials.

## Connection Setup

### 1. ORCA Server Configuration
Ensure the ORCA server is running and the `ORAPI021R4V2` interface is enabled.
- **Access Control**: The server running this application must have network access to the ORCA server.
- **User Permissions**: The `ORCA_USER` must have permissions to access the API.
- **Master Data Updates**: Ensure your ORCA server has the latest master data installed (see Data Freshness section below).

### 2. Dummy Patient Setup
To perform generic checks without linking to real patient data, a dummy patient must exist in the ORCA system.
1.  Log in to the ORCA client.
2.  Navigate to Patient Registration (患者登録).
3.  Register a new patient with ID `99999999` (or the value set in `DUMMY_PATIENT_ID`).
    - Name: `Drug Check Dummy` or `飲み合わせチェック用ダミー`
    - Birth Date: Any valid date (e.g., 1900-01-01)
    - Gender: Any
4.  Ensure the patient status is **Active** (有効).
5.  **Important**: Do NOT use this patient ID for any real medical records.

### 3. Testing the Connection
To verify the connection:
1.  Set `ORCA_MOCK_MODE=false` in your `.env` file.
2.  Start the backend server: `python backend/main.py`
3.  Send a request with two known interacting drugs (e.g., Warfarin and Aspirin):
    ```bash
    curl -X POST http://localhost:8000/api/check_interaction \
      -H "Content-Type: application/json" \
      -d '{
        "medications": [
          {"id": "1", "name": "ワーファリン", "type": "prescription", "currentlyTaking": true},
          {"id": "2", "name": "アスピリン", "type": "prescription", "currentlyTaking": true}
        ]
      }'
    ```
4.  Check the backend logs for successful API response parsing.
5.  Verify that the response includes interaction details.

## Logic Description
The application uses the following logic to perform checks:
1.  **Stateless Check**: It sends a request to the ORCA API using the `DUMMY_PATIENT_ID`.
2.  **Medical Information**: All drugs to be checked are included in the `Medical Information` block of the request (Method A from requirements).
3.  **Response Parsing**: The application parses the XML response to extract:
    - `Drug_Name_B` (Contra Name - Interacting Drug)
    - `Symptom_Content` (Risk Description - 懸念される事象)
    - `Symptom_Detail` (Mechanism/Management - 作用機序)
    - `Context_Class` (Interaction Classification - 併用禁忌/併用注意)

## Data Freshness (データ鮮度の担保)

> [!IMPORTANT]
> **Monthly Master Data Updates Required**

According to the requirements (A欄, section 2-1), maintaining up-to-date ORCA master data is critical.

### Update Procedure:
1. **Check Current Version**: Log in to your ORCA server and check the current master data version.
2. **Download Latest Master**: Visit the Japan Medical Association ORCA project site to download the latest monthly master data update.
3. **Apply Update**: Follow ORCA's official procedure to apply the master data update:
   ```bash
   # Example (exact commands may vary by ORCA version)
   cd /opt/orca
   sudo ./update_master.sh
   ```
4. **Verify Update**: After update, verify the new version is active.
5. **Restart Services**: Restart ORCA API services to ensure new data is loaded.

### Recommended Schedule:
- **Frequency**: Monthly (aligned with ORCA master data release schedule)
- **Timing**: Within 1 week of new master data release
- **Verification**: Test key interaction pairs after each update

## License Compliance

This application complies with the **Japan Medical Association Open Source License Agreement (Version 1.0)**:

✅ **Article 4, Section 2**: The drug interaction check feature is provided **free of charge**.
✅ **Article 4, Section 4**: Master data is **not modified** by the application. Only server-side processing via public transmission is used.
✅ **Article 4, Section 3**: The full license text is **easily accessible** to users via the License Modal in the application.

## Troubleshooting

### Connection Refused
- **Cause**: ORCA server is not running or URL is incorrect.
- **Solution**: 
  1. Verify `ORCA_API_URL` is correct.
  2. Ping the ORCA server to ensure network connectivity.
  3. Check ORCA server logs for startup errors.

### Authentication Error (401/403)
- **Cause**: Invalid credentials or insufficient permissions.
- **Solution**: 
  1. Verify `ORCA_USER` and `ORCA_PASSWORD` are correct.
  2. Check that the user has API access permissions in ORCA.
  3. Review ORCA audit logs for authentication failures.

### Patient Not Found Error
- **Cause**: The `DUMMY_PATIENT_ID` does not exist in ORCA.
- **Solution**: 
  1. Ensure the dummy patient is registered (see section 2 above).
  2. Verify the patient ID matches exactly (including leading zeros).
  3. Check that the patient status is Active.

### No Interactions Found (Expected Interactions Missing)
- **Cause**: Master data may be outdated or incomplete.
- **Solution**: 
  1. Verify master data version on ORCA server.
  2. Update to the latest master data (see Data Freshness section).
  3. Check ORCA documentation for known issues with specific drug combinations.

### Slow Response Times
- **Cause**: Network latency or ORCA server performance.
- **Solution**: 
  1. Check network latency between app server and ORCA server.
  2. Review ORCA server resource usage (CPU, memory, disk).
  3. Consider caching frequently checked combinations (with caution regarding data freshness).

## Development Mode (Mock)

For development and testing without a live ORCA server:
1. Set `ORCA_MOCK_MODE=true` in `.env`
2. The application will use internal mock logic
3. **Mock Limitations**:
   - Only recognizes a few predefined drug combinations (e.g., ワーファリン + ロキソニン)
   - Does not reflect actual ORCA master data
   - **Not suitable for production use**

## Security Considerations

⚠️ **Important Security Notes**:
- Store ORCA credentials securely (use environment variables, not hard-coded values)
- Use HTTPS for production deployments
- Regularly rotate API credentials
- Monitor API access logs for suspicious activity
- Ensure ORCA server is behind a firewall and not publicly accessible
