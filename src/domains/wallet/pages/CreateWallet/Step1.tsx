import { Environment, NetworkData, Profile } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FirstStep = ({ env, profile }: { env: Environment; profile: Profile }) => {
	const { getValues, setValue } = useFormContext();
	const [isGeneratingWallet, setIsGeneratingWallet] = React.useState(false);
	const networks = useMemo(() => env.availableNetworks(), [env]);

	const selectedNetwork: NetworkData = getValues("network");

	const { t } = useTranslation();

	const handleSelect = async (network?: NetworkData | null) => {
		const currentWallet = getValues("wallet");

		setValue("network", network, true);
		setValue("wallet", null, true);
		setValue("mnemonic", null, true);

		if (currentWallet) {
			profile.wallets().forget(currentWallet.id());
		}

		if (!network) {
			return;
		}

		setIsGeneratingWallet(true);
		const { mnemonic, wallet } = await profile.wallets().generate(network.coin(), network.id());
		setValue("wallet", wallet, true);
		setValue("mnemonic", mnemonic, true);
		setIsGeneratingWallet(false);
	};

	return (
		<section data-testid="CreateWallet__first-step" className="space-y-8">
			<div className="my-8">
				<Header
					title={t("WALLETS.PAGE_CREATE_WALLET.NETWORK_STEP.TITLE")}
					subtitle={t("WALLETS.PAGE_CREATE_WALLET.NETWORK_STEP.SUBTITLE")}
				/>
			</div>
			<div className="space-y-2">
				<FormField name="network" className="relative mt-1">
					<div className="mb-2">
						<FormLabel label={t("COMMON.NETWORK")} />
					</div>
					<SelectNetwork
						id="CreateWallet__network"
						networks={networks}
						selected={selectedNetwork}
						onSelect={handleSelect}
						disabled={isGeneratingWallet}
					/>
				</FormField>
			</div>
		</section>
	);
};