package processor

import (
	"github.com/wormhole-foundation/wormhole/sdk/vaa"
	"go.uber.org/zap"
)

type VAA struct {
	vaa.VAA
	Unreliable    bool
	Reobservation bool
}

// HandleQuorum is called when a VAA reaches quorum. It publishes the VAA to the gossip network and stores it in the database.
func (v *VAA) HandleQuorum(sigs []*vaa.Signature, hash string, p *Processor) {
	// Deep copy the observation and add signatures
	signed := &vaa.VAA{
		Version:          v.Version,
		GuardianSetIndex: v.GuardianSetIndex,
		Signatures:       sigs,
		Timestamp:        v.Timestamp,
		Nonce:            v.Nonce,
		Sequence:         v.Sequence,
		EmitterChain:     v.EmitterChain,
		EmitterAddress:   v.EmitterAddress,
		Payload:          v.Payload,
		ConsistencyLevel: v.ConsistencyLevel,
	}

	p.logger.Info("signed VAA with quorum",
		zap.String("message_id", signed.MessageID()),
		zap.String("digest", hash),
	)

	// Broadcast the VAA and store it in the database.
	p.broadcastSignedVAA(signed)
	p.storeSignedVAA(signed)
}

func (v *VAA) IsReliable() bool {
	return !v.Unreliable
}

func (v *VAA) IsReobservation() bool {
	return v.Reobservation
}
